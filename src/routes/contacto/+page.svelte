<script lang="ts">
	import { onMount } from 'svelte';
	import { _, locale } from 'svelte-i18n';
	import Footer from '$lib/components/Footer.svelte';
	import { scrollReveal } from '$lib/actions/scrollReveal';

	// Camino CRM API endpoint for lead capture
	const CAMINO_API_URL = 'https://camino.redbroomsoftware.com/api/leads';

	// reCAPTCHA v3 site key (GCP: Colectiva-RBS)
	const RECAPTCHA_SITE_KEY = '6LdpE2IrAAAAACprbiG263FNJ7p3DfTT-Q-uuCtG';

	let recaptchaLoaded = $state(false);

	function loadRecaptcha() {
		if (!RECAPTCHA_SITE_KEY || typeof window === 'undefined') return;
		const script = document.createElement('script');
		script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
		script.onload = () => { recaptchaLoaded = true; };
		document.head.appendChild(script);
	}

	async function getRecaptchaToken(): Promise<string | null> {
		if (!RECAPTCHA_SITE_KEY || !recaptchaLoaded) return null;
		try {
			const grecaptcha = (window as any).grecaptcha;
			return await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'contact_form' });
		} catch { return null; }
	}

	let visitorId = $state('');

	function getVisitorId(): string {
		if (typeof window === 'undefined') return '';
		let id = localStorage.getItem('rbs_visitor_id');
		if (!id) {
			id = `v_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
			localStorage.setItem('rbs_visitor_id', id);
		}
		return id;
	}

	onMount(() => {
		visitorId = getVisitorId();
		loadRecaptcha();
	});

	// Anti-spam: honeypot field (bots fill this, humans don't see it)
	let honeypot = $state('');
	// Anti-spam: timing check (bots submit instantly)
	let formLoadedAt = $state(0);
	onMount(() => {
		formLoadedAt = Date.now();
	});

	// Contact form state
	let contactForm = $state({
		name: '',
		email: '',
		company: '',
		phone: '',
		projectType: '',
		message: ''
	});
	let submitStatus: 'idle' | 'submitting' | 'success' | 'error' = $state('idle');
	let errorMessage = $state('');

	const projectTypeKeys = ['saas', 'pos', 'crm', 'mobile', 'integration', 'consulting', 'other'] as const;

	async function handleContactSubmit(event: Event) {
		event.preventDefault();

		// Anti-spam: honeypot check
		if (honeypot) {
			// Bot filled the hidden field — silently "succeed" to not tip off the bot
			submitStatus = 'success';
			return;
		}

		// Anti-spam: timing check — reject if submitted in under 3 seconds
		const elapsed = Date.now() - formLoadedAt;
		if (elapsed < 3000) {
			submitStatus = 'success'; // Silent fake success
			return;
		}

		submitStatus = 'submitting';
		errorMessage = '';

		try {
			const urlParams = new URLSearchParams(window.location.search);
			const recaptchaToken = await getRecaptchaToken();

			const response = await fetch(CAMINO_API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: contactForm.name,
					email: contactForm.email,
					company: contactForm.company,
					phone: contactForm.phone,
					product: contactForm.projectType,
					message: contactForm.message,
					source: 'rbs_website',
					formType: 'contact',
					landingPage: window.location.href,
					referrer: document.referrer || undefined,
					utm_source: urlParams.get('utm_source') || 'direct',
					utm_medium: urlParams.get('utm_medium') || 'organic',
					utm_campaign: urlParams.get('utm_campaign'),
					campaign_id: urlParams.get('campaign_id'),
					visitorId,
					recaptcha_token: recaptchaToken
				})
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || $_('contact.form.errorSubmit'));
			}

			submitStatus = 'success';
			contactForm = { name: '', email: '', company: '', phone: '', projectType: '', message: '' };
		} catch (error) {
			console.error('Form submission error:', error);
			submitStatus = 'error';
			errorMessage = error instanceof Error ? error.message : $_('contact.form.errorGeneric');
		}
	}
</script>

<svelte:head>
	<title>{$_('contact.meta.title')}</title>
	<meta name="description" content={$_('contact.meta.description')} />
	<meta property="og:locale" content={$locale === 'es' ? 'es_MX' : 'en_US'} />
	<link rel="canonical" href="https://redbroomsoftware.com/contacto" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://redbroomsoftware.com/contacto" />
	<meta property="og:title" content={$_('contact.meta.title')} />
	<meta property="og:description" content={$_('contact.meta.description')} />
	<meta property="og:image" content="https://redbroomsoftware.com/logo.svg" />
	<meta name="twitter:card" content="summary" />
</svelte:head>

<!-- Hero -->
<section class="py-20 px-4 sm:px-6 lg:px-8 relative">
	<div class="max-w-7xl mx-auto text-center relative">
		<h2 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
			{$_('contact.hero.titlePart1')} <span class="text-gray-500">{$_('contact.hero.titleHighlight')}</span>
		</h2>
		<p class="text-xl text-gray-600 max-w-2xl mx-auto">
			{$_('contact.hero.subtitle')}
		</p>
	</div>
</section>

<!-- Contact Form & Info -->
<section class="py-16 px-4 sm:px-6 lg:px-8">
	<div class="max-w-7xl mx-auto">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
			<!-- Form -->
			<div use:scrollReveal class="glass-strong rounded-2xl p-8">
				{#if submitStatus === 'success'}
					<div class="text-center py-12">
						<div class="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
							</svg>
						</div>
						<h3 class="text-2xl font-bold text-gray-900 mb-2">{$_('contact.form.successTitle')}</h3>
						<p class="text-gray-600">{$_('contact.form.successMessage')}</p>
					</div>
				{:else}
					<h3 class="text-2xl font-bold text-gray-900 mb-6">{$_('contact.form.title')}</h3>
					<form onsubmit={handleContactSubmit} class="space-y-6">
						<!-- Honeypot: invisible to humans, bots auto-fill it -->
						<div aria-hidden="true" style="position:absolute;left:-9999px;top:-9999px;height:0;overflow:hidden;opacity:0;">
							<label for="website">Website</label>
							<input type="text" id="website" name="website" tabindex="-1" autocomplete="off" bind:value={honeypot} />
						</div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label for="name" class="block text-sm text-gray-600 mb-2">{$_("contact.form.nameLabel")} {$_("contact.form.required")}</label>
								<input
									type="text"
									id="name"
									bind:value={contactForm.name}
									required
									class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-gray-900 focus:outline-none"
								/>
							</div>
							<div>
								<label for="email" class="block text-sm text-gray-600 mb-2">{$_("contact.form.emailLabel")} {$_("contact.form.required")}</label>
								<input
									type="email"
									id="email"
									bind:value={contactForm.email}
									required
									class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-gray-900 focus:outline-none"
								/>
							</div>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label for="company" class="block text-sm text-gray-600 mb-2">{$_("contact.form.companyLabel")}</label>
								<input
									type="text"
									id="company"
									bind:value={contactForm.company}
									class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-gray-900 focus:outline-none"
								/>
							</div>
							<div>
								<label for="phone" class="block text-sm text-gray-600 mb-2">{$_("contact.form.phoneLabel")}</label>
								<input
									type="tel"
									id="phone"
									bind:value={contactForm.phone}
									class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-gray-900 focus:outline-none"
								/>
							</div>
						</div>

						<div>
							<label for="projectType" class="block text-sm text-gray-600 mb-2">{$_("contact.form.projectTypeLabel")}</label>
							<select
								id="projectType"
								bind:value={contactForm.projectType}
								class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-gray-900 focus:outline-none"
							>
								<option value="">{$_("contact.form.selectOption")}</option>
								{#each projectTypeKeys as key}
									<option value={key}>{$_(`contact.form.projectTypes.${key}`)}</option>
								{/each}
							</select>
						</div>

						<div>
							<label for="message" class="block text-sm text-gray-600 mb-2">{$_("contact.form.messageLabel")} {$_("contact.form.required")}</label>
							<textarea
								id="message"
								bind:value={contactForm.message}
								required
								rows="4"
								class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-gray-900 focus:outline-none resize-none"
								placeholder={$_("contact.form.messagePlaceholder")}
							></textarea>
						</div>

						{#if submitStatus === 'error'}
							<div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
								{errorMessage}
							</div>
						{/if}

						<button
							type="submit"
							disabled={submitStatus === 'submitting'}
							class="w-full px-6 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{submitStatus === 'submitting' ? $_('contact.form.submitting') : $_('contact.form.submitButton')}
						</button>
					</form>
				{/if}
			</div>

			<!-- Info -->
			<div class="space-y-8" use:scrollReveal={{ delay: 200 }}>
				<div>
					<h3 class="text-2xl font-bold text-gray-900 mb-4">{$_('contact.process.title')}</h3>
					<div class="space-y-4">
						<div class="flex items-start gap-4">
							<div class="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
							<div>
								<h4 class="text-gray-900 font-semibold">{$_('contact.process.step1.title')}</h4>
								<p class="text-gray-600 text-sm">{$_('contact.process.step1.desc')}</p>
							</div>
						</div>
						<div class="flex items-start gap-4">
							<div class="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
							<div>
								<h4 class="text-gray-900 font-semibold">{$_('contact.process.step2.title')}</h4>
								<p class="text-gray-600 text-sm">{$_('contact.process.step2.desc')}</p>
							</div>
						</div>
						<div class="flex items-start gap-4">
							<div class="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
							<div>
								<h4 class="text-gray-900 font-semibold">{$_('contact.process.step3.title')}</h4>
								<p class="text-gray-600 text-sm">{$_('contact.process.step3.desc')}</p>
							</div>
						</div>
					</div>
				</div>

				<div class="glass rounded-2xl p-6">
					<h4 class="text-gray-900 font-semibold mb-4">{$_('contact.directContact.title')}</h4>
					<div class="space-y-3">
						<a href="mailto:contacto@redbroomsoftware.com" class="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
							</svg>
							contacto@redbroomsoftware.com
						</a>
					</div>
				</div>

				<div class="bg-gray-50 rounded-2xl border border-gray-200 p-6">
					<h4 class="text-gray-900 font-semibold mb-2">{$_('contact.urgent.title')}</h4>
					<p class="text-gray-600 text-sm mb-4">{$_('contact.urgent.desc')}</p>
				</div>
			</div>
		</div>
	</div>
</section>

<Footer />
