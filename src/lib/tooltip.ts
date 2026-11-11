export type TooltipSide = 'left' | 'right' | 'top' | 'bottom';

/** daisyUI's placement classes, written out in full so Tailwind finds them. */
export const TOOLTIP_SIDE: Record<TooltipSide, string> = {
	left: 'tooltip-left',
	right: 'tooltip-right',
	top: 'tooltip-top',
	bottom: 'tooltip-bottom'
};
