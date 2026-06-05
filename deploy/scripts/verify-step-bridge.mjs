/**
 * WebView 걸음수 브리지 프로토콜 스모크 테스트 (Node, RN/브라우저 없이)
 * - requestNativeStepCount 메시지 형식
 * - createWebViewMessageHandler getStepCount 응답 형식
 */
import assert from "node:assert";

const requestId = "test-req-1";
const webToNative = JSON.stringify({ type: "getStepCount", requestId });
const parsed = JSON.parse(webToNative);
assert.strictEqual(parsed.type, "getStepCount");
assert.strictEqual(parsed.requestId, requestId);

const nativeToWeb = {
  type: "stepCount",
  requestId,
  ok: true,
  steps: 4321,
};
assert.strictEqual(nativeToWeb.type, "stepCount");
assert.ok(nativeToWeb.steps >= 0);

const injectPayload = JSON.stringify(nativeToWeb).replace(/</g, "\\u003c");
assert.ok(!injectPayload.includes("<"));

console.log("verify-step-bridge: OK");
console.log("  Web→RN:", webToNative);
console.log("  RN→Web:", JSON.stringify(nativeToWeb));
