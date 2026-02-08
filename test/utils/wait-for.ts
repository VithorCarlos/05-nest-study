export async function waitFor(
  assertions: () => void | Promise<void>,
  maxDuration = 1000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    let elapsedTime = 0;

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const interval = setInterval(async () => {
      elapsedTime += 10;

      try {
        await assertions();
        clearInterval(interval);
        resolve();
      } catch (err) {
        if (elapsedTime >= maxDuration) {
          reject(err instanceof Error ? err : new Error('waitFor timed out'));
        }
      }
    }, 10);
  });
}
