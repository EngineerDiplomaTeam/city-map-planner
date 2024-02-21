import { ErrorToMessagePipe } from './error-to-message.pipe';

describe('ErrorToMessagePipe', () => {
  it('create an instance', () => {
    const pipe = new ErrorToMessagePipe();
    expect(pipe).toBeTruthy();
  });
});
