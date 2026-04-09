import { Locator, Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected page: Page) {}

  protected async logClick(locator: Locator) {
    const elementInfo = await this.getElementInfo(locator);
    console.log(`[Click] ${elementInfo}`);
  }

  async goto(): Promise<void> {}

  abstract expectOnPage(): Promise<void>;

  protected async logFill(locator: Locator, value?: string) {
    const elementInfo = await this.getElementInfo(locator);
    const valueInfo = value ? ` with value: ${value}` : '';
    console.log(`[Fill] ${elementInfo}${valueInfo}`);
  }

  protected async clickWithLog(locator: Locator, options?: Parameters<Locator['click']>[0]) {
    await this.logClick(locator);
    await locator.click();
  }
  protected async fillWithLog(
    locator: Locator,
    value: string,

    options?: {
      isSensitive?: boolean;
      fillOptions?: Parameters<Locator['fill']>[1];
    }
  ) {
    let isSensitive = options?.isSensitive;
    const logValue = isSensitive ? '****' : value;
    await this.logFill(locator, logValue);

    await locator.fill(value, options?.fillOptions);
  }
  private async getElementInfo(locator: Locator): Promise<string> {
    let text = '';
    try {
      text = await locator.innerText();
      text = text.trim();
    } catch {
      try {
        const textContent = await locator.textContent();
        text = textContent?.trim() || '';
      } catch {
        try {
          const value = await locator.inputValue();
          if (value) {
            text = `value= ${value}`;
          }
        } catch {}
      }
    }
    return text;
  }
}