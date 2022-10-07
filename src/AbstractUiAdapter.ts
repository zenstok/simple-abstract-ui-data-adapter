/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment */
abstract class AbstractUiAdapter<ApiDataModel> {
  public async construct(apiData: ApiDataModel): Promise<this> {
    await this.onBeforeAttributes(apiData);
    this.applyAttributes(apiData);
    this.applyRuntimeValidations();
    await this.onAfterAttributes();

    return this;
  }

  protected async onBeforeAttributes(apiData: ApiDataModel): Promise<void> {}

  protected abstract applyAttributes(apiData: ApiDataModel): void;

  protected applyRuntimeValidations(): void {}

  protected async onAfterAttributes(): Promise<void> {}

  public static async create<ApiDataModel, UiDataModel>(
    apiData: ApiDataModel
  ): Promise<UiDataModel> {
    if (this.name === 'AbstractUiAdapter') {
      throw new Error('You cannot use AbstractUiAdapter class!');
    }
    // @ts-ignore
    return new this().construct(apiData);
  }
}

export default AbstractUiAdapter;
