/* eslint-disable @typescript-eslint/ban-ts-comment */
abstract class AbstractUiAdapter<ApiDataModel> {
  private construct(apiData: ApiDataModel): this {
    this.applyAttributes(apiData);
    this.applyRuntimeValidations();

    return this;
  }

  protected abstract applyAttributes(apiData: ApiDataModel): void;

  protected applyRuntimeValidations(): void {}

  public static create<ApiDataModel, UiDataModel>(
    apiData: ApiDataModel
  ): UiDataModel {
    if (this.name === 'AbstractUiAdapter') {
      throw new Error('You cannot use AbstractUiAdapter class!');
    }
    // @ts-ignore
    return new this().construct(apiData);
  }
}

export default AbstractUiAdapter;
