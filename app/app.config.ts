// Nuxt UI theme bindings. Setting `primary` here means every UButton, UInput,
// UBadge etc. picks up the brand yellow without per-component color props.
export default defineAppConfig({
  ui: {
    primary: 'brand',
    gray: 'slate',
    button: {
      rounded: 'rounded-full',
      default: { size: 'md' },
      color: {
        /**
         * Solid brand buttons only — ghost/link/soft variants keep the stock
         * treatment, where a sheen and a lift would look out of place.
         *
         * Three things happen on hover: the gradient brightens, the button
         * lifts 2px with a brand-tinted glow beneath it, and a soft highlight
         * sweeps across. The sweep is a `::before` that starts parked off the
         * left edge and slides right; `overflow-hidden` keeps it inside the
         * pill and `pointer-events-none` keeps it from eating the click.
         *
         * Every rule is repeated with a `dark:` variant because colour mode is
         * forced to dark, and Nuxt UI's own `dark:bg-{color}-400` default would
         * otherwise win the merge.
         */
        primary: {
          solid: [
            'relative overflow-hidden',
            'bg-gradient-to-b from-brand-400 to-brand-500 dark:from-brand-400 dark:to-brand-500',
            'text-ink-950 dark:text-ink-950 shadow-sm',
            'transition-all duration-300 ease-out',
            'hover:-translate-y-0.5 hover:from-brand-300 hover:to-brand-400',
            'dark:hover:from-brand-300 dark:hover:to-brand-400',
            'hover:shadow-lg hover:shadow-brand-500/30',
            'active:translate-y-0 active:shadow-sm',
            'before:pointer-events-none before:absolute before:inset-0',
            'before:-translate-x-full before:bg-gradient-to-r',
            'before:from-transparent before:via-white/40 before:to-transparent',
            'before:transition-transform before:duration-700 before:ease-out',
            'hover:before:translate-x-full',
            'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
            'motion-reduce:before:transition-none',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
          ].join(' '),
        },
      },
    },
    card: {
      rounded: 'rounded-3xl',
      background: 'bg-white/5',
      ring: 'ring-1 ring-white/10',
      divide: 'divide-y divide-white/10',
    },
    input: { rounded: 'rounded-full' },
    select: { rounded: 'rounded-full' },
    badge: { rounded: 'rounded-full' },
    // Glassmorphism panel: translucent dark surface over a blurred backdrop,
    // hairline ring instead of a hard border. Defined here rather than on the
    // component so every dropdown in the app matches.
    //
    // Every value repeats itself with a `dark:` variant. Nuxt UI merges these
    // strings with the component defaults, and tailwind-merge only drops a
    // default when our class conflicts with it at the same variant. Passing
    // plain `bg-ink-950/70` leaves the default `dark:bg-gray-800` in place —
    // and since color mode is forced to dark, the default would win.
    dropdown: {
      width: 'w-56',
      background: 'bg-ink-950/70 dark:bg-ink-950/70 backdrop-blur-xl',
      shadow: 'shadow-2xl shadow-black/50',
      rounded: 'rounded-2xl',
      ring: 'ring-1 ring-white/10 dark:ring-white/10',
      divide: 'divide-y divide-white/5 dark:divide-white/5',
      padding: 'p-1.5',
      item: {
        // The `active` state below is driven by HeadlessUI and only fires for
        // keyboard navigation here — hovering with a mouse never sets it, which
        // left the items with no feedback at all. These `hover:` utilities are
        // plain CSS, so they work regardless of component state.
        // `dark:hover:` is required as well: Tailwind orders the `dark` variant
        // after `hover`, so a plain `hover:text-white` loses to the
        // `dark:text-white/70` below at equal specificity.
        base: 'group/item flex items-center gap-2 w-full transition-colors duration-150 hover:bg-white/10 hover:text-white dark:hover:text-white',
        rounded: 'rounded-xl',
        padding: 'px-3 py-2.5',
        active: 'bg-white/10 text-white dark:bg-white/10 dark:text-white',
        inactive: 'text-white/70 dark:text-white/70',
        icon: {
          // Named group: the dropdown container also carries a plain `group`
          // class, so an unnamed `group-hover:` would light every icon up as
          // soon as the pointer entered the panel.
          base: 'flex-shrink-0 h-4 w-4 transition-colors duration-150 group-hover/item:text-brand-500',
          active: 'text-brand-500 dark:text-brand-500',
          inactive: 'text-white/40 dark:text-white/40',
        },
      },
    },
  },
})
