import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import CallForPrice from '@/components/CallForPrice';
import { installAutomaticGoalTracking } from '@/lib/metrika';

describe('contact conversion deduplication', () => {
  afterEach(() => {
    cleanup();
    sessionStorage.clear();
    localStorage.clear();
    delete window.ym;
    vi.unstubAllGlobals();
  });

  it.each(['phone_click', 'whatsapp_click', 'telegram_click', 'max_click'])(
    'sends %s exactly once for one rendered contact click', (goal) => {
      const ym = vi.fn();
      window.ym = ym;
      vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(new Response())));
      const { container } = render(<CallForPrice />);
      const dispose = installAutomaticGoalTracking();
      const links = [...container.querySelectorAll('a')];
      const index = ['phone_click', 'whatsapp_click', 'telegram_click', 'max_click'].indexOf(goal);
      const link = links[index];
      link.addEventListener('click', event => event.preventDefault());
      fireEvent.click(link);
      expect(ym).toHaveBeenCalledTimes(1);
      expect(ym).toHaveBeenCalledWith(113958872, 'reachGoal', goal,
        expect.objectContaining({ placement: 'call_for_price' }));
      dispose();
    }
  );
});
