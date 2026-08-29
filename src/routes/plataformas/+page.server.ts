import type { PageServerLoad } from './$types';

const CAMINO_CONTENT_API = 'https://camino.redbroomsoftware.com/api/public/page';
const CAMINO_PRICING_API = 'https://camino.redbroomsoftware.com/api/public/pricing';

/** Apps displayed on the plataformas page that exist in Camino's pricing registry */
const PRICED_APPS = ['caracol', 'comal', 'constanza', 'plenura', 'rito', 'agora', 'mancha', 'cosmos_pet', 'garita', 'la-hoja', 'patadas', 'goodbay', 'cookie-monster', 'puppy-love', 'baul', 'continua', 'colectiva'] as const;

export const load: PageServerLoad = async ({ url, cookies, request }) => {
	let visitorId = cookies.get('camino_visitor');
	if (!visitorId) {
		visitorId = crypto.randomUUID();
		cookies.set('camino_visitor', visitorId, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 365 * 24 * 60 * 60
		});
	}

	const params = new URLSearchParams({ visitor_id: visitorId });
	const utmSource = url.searchParams.get('utm_source');
	const utmMedium = url.searchParams.get('utm_medium');
	const utmCampaign = url.searchParams.get('utm_campaign');
	if (utmSource) params.set('utm_source', utmSource);
	if (utmMedium) params.set('utm_medium', utmMedium);
	if (utmCampaign) params.set('utm_campaign', utmCampaign);

	/* Resolución de región (corregido S709).
	 *
	 * La intención original era reenviar `x-vercel-ip-country` a la API de precios de
	 * Camino, pero esa API IGNORA la cabecera — medido: con `x-vercel-ip-country: ZZ`
	 * devuelve MX igual que sin cabecera. Lo único que respeta es el query param
	 * `region`, y ese sólo se enviaba cuando alguien lo ponía a mano en la URL.
	 *
	 * Efecto: la petición sale del SERVIDOR de Vercel (IP estadounidense), Camino
	 * geolocaliza a quien llama —no al visitante— y devolvía `region: US`,
	 * `currency: USD`. La página en producción recibía Caracol a 59 en vez de 425.
	 *
	 * Hoy eso queda latente porque los precios visibles vienen del contenido de
	 * Camino; el camino de RESPALDO (`getDynamicPricing`) sí usa estos datos, y como
	 * `formatPrice` usa locale en-US para USD, habría pintado "$59/usuario/mes" — que
	 * un lector mexicano lee como 59 PESOS. No es un precio en otra moneda: es un
	 * precio ambiguo, que es peor.
	 *
	 * Por eso la región viaja ahora como parámetro. La API sólo reconoce MX y US;
	 * cualquier otro país cae a su default (MX), que es lo correcto para un negocio
	 * mexicano. No cambia ningún precio: sirve el que ya existe para cada región. */
	const regionOverride = url.searchParams.get('region');
	const countryHeader = request.headers.get('x-vercel-ip-country') || '';
	const pricingParams = new URLSearchParams();
	const regionEfectiva = regionOverride || countryHeader;
	if (regionEfectiva) {
		pricingParams.set('region', regionEfectiva);
	}

	// Fetch content and pricing in parallel
	const [contentResult, pricingResult] = await Promise.all([
		fetchContent(params, request),
		fetchAllPricing(pricingParams, countryHeader)
	]);

	return {
		content: contentResult,
		visitorId,
		pricing: pricingResult.pricing,
		region: pricingResult.region,
		currency: pricingResult.currency
	};
};

async function fetchContent(
	params: URLSearchParams,
	request: Request
): Promise<Record<string, unknown> | null> {
	try {
		const res = await fetch(`${CAMINO_CONTENT_API}/plataformas?${params}`, {
			headers: { 'User-Agent': request.headers.get('user-agent') || '' }
		});
		if (res.ok) return res.json();
	} catch (e) {
		console.error('[Plataformas] Camino content API error:', e);
	}
	return null;
}

interface PricingTier {
	id: string;
	name: string;
	price: number;
	billing_cycle: string;
	custom_pricing?: boolean;
	per_cover_rate?: number;
}

interface AppPricing {
	app_id: string;
	currency: string;
	region: string;
	tiers: PricingTier[];
	pricing_model: string;
	subscription_info?: {
		per_user_price?: number;
		implementation_fee?: number;
		[key: string]: unknown;
	};
}

async function fetchAllPricing(
	params: URLSearchParams,
	countryHeader: string
): Promise<{
	pricing: Record<string, AppPricing> | null;
	region: string | null;
	currency: string | null;
}> {
	try {
		const headers: Record<string, string> = {};
		if (countryHeader) {
			headers['x-vercel-ip-country'] = countryHeader;
		}

		const results = await Promise.all(
			PRICED_APPS.map(async (appId) => {
				try {
					const res = await fetch(`${CAMINO_PRICING_API}/${appId}?${params}`, { headers });
					if (res.ok) return { appId, data: (await res.json()) as AppPricing };
				} catch {
					// Individual app failure is non-fatal
				}
				return { appId, data: null };
			})
		);

		const pricing: Record<string, AppPricing> = {};
		let region: string | null = null;
		let currency: string | null = null;

		for (const { appId, data } of results) {
			if (data) {
				pricing[appId] = data;
				// All apps return the same region/currency, grab from the first success
				if (!region) {
					region = data.region;
					currency = data.currency;
				}
			}
		}

		// If we got zero successful responses, return null
		if (Object.keys(pricing).length === 0) return { pricing: null, region: null, currency: null };

		return { pricing, region, currency };
	} catch (e) {
		console.error('[Plataformas] Camino pricing API error:', e);
		return { pricing: null, region: null, currency: null };
	}
}
