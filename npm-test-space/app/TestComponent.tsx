import { packageMessage } from '../../npm-test-package/src';

export default function TestComponent() {
  return (
    <div>
      <h1>{packageMessage}</h1>
    </div>
  );
}
