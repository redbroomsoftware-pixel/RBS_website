<script lang="ts">
	let { words, interval = 3000 }: { words: string[]; interval?: number } = $props();

	let currentIndex = $state(0);
	let currentText = $state('');
	let isDeleting = $state(false);

	$effect(() => {
		const word = words[currentIndex];
		let timeout: ReturnType<typeof setTimeout>;

		if (!isDeleting && currentText === word) {
			timeout = setTimeout(() => { isDeleting = true; }, interval);
		} else if (isDeleting && currentText === '') {
			isDeleting = false;
			currentIndex = (currentIndex + 1) % words.length;
		} else if (isDeleting) {
			timeout = setTimeout(() => {
				currentText = word.slice(0, currentText.length - 1);
			}, 40);
		} else {
			timeout = setTimeout(() => {
				currentText = word.slice(0, currentText.length + 1);
			}, 80);
		}

		return () => clearTimeout(timeout);
	});
</script>

<span class="text-gray-900">{currentText}</span><span class="animate-pulse text-gray-400">|</span>
