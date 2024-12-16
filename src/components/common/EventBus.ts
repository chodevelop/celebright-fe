/**
 * EventBus.ts
 * 작성자: 조영우(chodevelop)
 * 작성일: 2024/11/20
 */

const eventBus = {
  on(event: string, callback: EventListener) {
    document.addEventListener(event, (e) => callback(e));
  },
  dispatch(event: string, data?: any) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  },
  remove(event: string, callback: EventListener) {
    document.removeEventListener(event, callback);
  },
};

export default eventBus;
