import { useState } from 'react';
import { useForwardAccountApi } from 'src/apis/forward/forward.api';
import { useCountdown } from 'usehooks-ts';

export default function useResendActiveEmail() {
    const [count, { startCountdown, resetCountdown }] = useCountdown({
        countStart: 60,
        intervalMs: 1000,
        countStop: 0,
        isIncrement: false,
    });

    const { mutateAsync } = useForwardAccountApi();

    const [sent, setSent] = useState(false);

    return { count, startCountdown, resetCountdown, mutateAsync, setSent, sent };
}
