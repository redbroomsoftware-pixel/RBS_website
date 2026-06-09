<script lang="ts">
  import { _ } from 'svelte-i18n';

  const CAMINO_URL = 'https://camino.redbroomsoftware.com/api/public/sales-chat';
  const WHATSAPP_NUMBER = '527298949548';
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

  interface Message {
    role: 'user' | 'assistant';
    content: string;
  }

  let isOpen = $state(false);
  let isExpanded = $state(false);
  let messages = $state<Message[]>([]);
  let inputText = $state('');
  let isLoading = $state(false);
  let chatContainer: HTMLDivElement | undefined = $state();

  function getVisitorId(): string {
    if (typeof localStorage === 'undefined') return `v_${Date.now()}`;
    let id = localStorage.getItem('rbs_visitor_id');
    if (!id) {
      id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem('rbs_visitor_id', id);
    }
    return id;
  }

  function scrollToBottom() {
    if (chatContainer) {
      setTimeout(() => {
        chatContainer!.scrollTop = chatContainer!.scrollHeight;
      }, 50);
    }
  }

  function stripLeadTags(text: string): string {
    return text.replace(/\[LEAD:[^\]]+\]/g, '').trim();
  }

  async function sendMessage() {
    const text = inputText.trim();
    if (!text || isLoading) return;

    inputText = '';
    messages.push({ role: 'user', content: text });
    scrollToBottom();

    isLoading = true;

    // Add placeholder for assistant response
    const assistantIndex = messages.length;
    messages.push({ role: 'assistant', content: '' });

    try {
      const response = await fetch(CAMINO_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.slice(0, -1).map(m => ({ role: m.role, content: m.content })),
          visitorId: getVisitorId()
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        messages[assistantIndex].content = (err as any).fallback || $_('chat.errorGeneric');
        isLoading = false;
        scrollToBottom();
        return;
      }

      // Stream the response
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              messages[assistantIndex].content += parsed.content;
              scrollToBottom();
            }
          } catch {
            // skip
          }
        }
      }

      // Clean up any LEAD tags from visible text
      messages[assistantIndex].content = stripLeadTags(messages[assistantIndex].content);

    } catch {
      messages[assistantIndex].content = $_('chat.errorConnection');
    }

    isLoading = false;
    scrollToBottom();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function toggleChat() {
    isOpen = !isOpen;
    if (!isOpen) isExpanded = false;
    if (isOpen && messages.length === 0) {
      messages.push({
        role: 'assistant',
        content: $_('chat.greeting')
      });
    }
    scrollToBottom();
  }

  function toggleExpand() {
    isExpanded = !isExpanded;
  }

  function openWhatsApp() {
    const lastUserMsg = messages.filter(m => m.role === 'user').pop()?.content || '';
    const prefilledText = lastUserMsg
      ? $_('chat.whatsappPrefill').replace('{message}', lastUserMsg)
      : $_('chat.whatsappDefault');
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(prefilledText)}`, '_blank');
  }
</script>

<!-- Floating Chat Button -->
<button
  onclick={toggleChat}
  class="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg shadow-black/20 transition-all duration-300 hover:scale-110 hover:bg-gray-800"
  aria-label={isOpen ? $_('chat.closeChat') : $_('chat.openChat')}
>
  {#if isOpen}
    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  {:else}
    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  {/if}
</button>

<!-- Chat Panel -->
{#if isOpen}
  <div
    class="fixed z-50 flex flex-col overflow-hidden border border-gray-200 shadow-2xl shadow-black/10 transition-all duration-300 ease-in-out
      max-sm:bottom-0 max-sm:right-0 max-sm:h-full max-sm:w-full max-sm:rounded-none
      sm:bottom-24 sm:right-6 sm:rounded-2xl
      {isExpanded ? 'sm:h-[calc(100vh-7rem)] sm:w-[520px]' : 'sm:h-[600px] sm:w-[420px]'}"
    style="background: #ffffff;"
  >

    <!-- Header -->
    <div class="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
      <div class="flex h-9 w-9 items-center justify-center rounded-full bg-black">
        <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div class="flex-1">
        <p class="text-sm font-semibold text-gray-900">Red Broom Software</p>
        <p class="text-xs text-gray-500">{$_('chat.salesAssistant')}</p>
      </div>
      <div class="flex items-center gap-1">
        <!-- WhatsApp button -->
        <button
          onclick={openWhatsApp}
          class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-green-600"
          title={$_('chat.continueWhatsApp')}
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </button>
        <!-- Expand/collapse button (desktop only) -->
        <button
          onclick={toggleExpand}
          class="hidden rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 sm:block"
          title={isExpanded ? $_('chat.collapse') : $_('chat.expand')}
        >
          {#if isExpanded}
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9L4 4m0 0v4m0-4h4m6 6l5 5m0 0v-4m0 4h-4" />
            </svg>
          {:else}
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 3h6m0 0v6m0-6l-7 7M9 21H3m0 0v-6m0 6l7-7" />
            </svg>
          {/if}
        </button>
        <!-- Close button (mobile) -->
        <button onclick={toggleChat} class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 sm:hidden">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Messages -->
    <div bind:this={chatContainer} class="flex-1 overflow-y-auto px-4 py-3 space-y-3" style="scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent;">
      {#each messages as msg}
        <div class="flex {msg.role === 'user' ? 'justify-end' : 'justify-start'}">
          <div class="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed {msg.role === 'user'
            ? 'bg-black text-white rounded-br-md'
            : 'bg-gray-100 text-gray-800 rounded-bl-md border border-gray-200'}">
            {#if msg.content}
              {msg.content}
            {:else}
              <span class="inline-flex gap-1">
                <span class="h-2 w-2 animate-bounce rounded-full bg-gray-400" style="animation-delay: 0ms"></span>
                <span class="h-2 w-2 animate-bounce rounded-full bg-gray-400" style="animation-delay: 150ms"></span>
                <span class="h-2 w-2 animate-bounce rounded-full bg-gray-400" style="animation-delay: 300ms"></span>
              </span>
            {/if}
          </div>
        </div>
      {/each}
    </div>

    <!-- Input -->
    <div class="border-t border-gray-100 px-4 py-3">
      <div class="flex items-center gap-2">
        <input
          type="text"
          bind:value={inputText}
          onkeydown={handleKeydown}
          placeholder={$_('chat.placeholder')}
          disabled={isLoading}
          class="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-900 disabled:opacity-50"
        />
        <button
          onclick={sendMessage}
          disabled={isLoading || !inputText.trim()}
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white transition-all hover:bg-gray-800 disabled:opacity-50"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
      <div class="mt-2 flex items-center justify-between">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 text-[11px] text-gray-400 transition-colors hover:text-green-600"
        >
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {$_('chat.continueWhatsApp')}
        </a>
        <p class="text-[10px] text-gray-400">{$_('chat.poweredBy')}</p>
      </div>
    </div>
  </div>
{/if}
