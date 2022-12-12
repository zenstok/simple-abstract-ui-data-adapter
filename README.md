### This is a simple abstract ui data adapter that will help you separate api data from ui data following [aspect-oriented programming approach](https://en.wikipedia.org/wiki/Aspect-oriented_programming).

### Installation

```bash
npm install simple-abstract-ui-data-adapter
# or
yarn add simple-abstract-ui-data-adapter
```

### Define your ui interface:

```typescript
interface CarUiInterface {
    id: string;
    brand: string;
    model: string;
    launchDate: Date;
}
```

### Your api response data for getting a car:
```typescript
interface GetCarApiResponseData {
    id: number;
    brand: string;
    model: string:
    launch_date: string;
}
```

### Create an ui adapter class that implements this interface and then extend AbstractUiAdapter. It accepts as generic the interface for api response data.

```typescript
import { AbstractUiAdapter } from 'simple-abstract-ui-data-adapter';

class CarUiAdapter
extends AbstractUiAdapter<GetCarApiResponseData>
implements CarUiInterface
{
    id: string;
    
    brand: string;
    
    model: string;
    
    launchDate: Date;
    
    protected applyAttributes(apiData: GetCarApiResponseData): void {
        this.id = apiData.id.toString();
        this.brand = apiData.charAt(0).toUpperCase() + apiData.slice(1); // pretend you need brand string capitalized
        this.model = apiData.model;
        this.launchDate = new Date(apiData.launch_date);
    }
    
    protected applyRuntimeValidations() {
        if (Number.isNaN(this.launchDate.getTime())) {
            throw new Error('Invalid date string received from api!');
        }
    }
    
    protected onBeforeAttributes(apiData: GetCarApiResponseData): Promise<void> {
        // hook to apply extra logic if needed (not required to be extended)
    }
    
    protected async onAfterAttributes(): Promise<void> {
        // hook to apply extra logic if needed (not required to be extended)
        // here you have access to defined attributes using this
    }
}
```


### How to use:
```typescript
const carModel = await CarUiAdapter.create<GetCarApiResponseData, CarUiInterface>(apiData);
```

### Reduce boilerplate using a helper like this:
```typescript
export class CarUiHelper {
    public static async getUiModel(apiData: GetCarApiResponseData): Promise<CarUiInterface> {
        return CarUiAdapter.create<GetCarApiResponseData, CarUiInterface>(apiData);
    }
}
```

### Simple usage:
```typescript
const carModel = await CarUiHelper.getUiModel(apiData);
```

Now let's pretend your api structure changed, or you use a new API with a completely different structure. The only place in your app where you will need to make changes is
implementation of method `applyAttributes(apiData: GetCarApiResponseData): void`.

### New API interface:
```typescript
interface GetCarApiResponseData {
    id: number;
    brandWithModel: string;
    launch_date: number;
}
```

### Required updates:
```typescript
protected applyAttributes(apiData: GetCarApiResponseData): void {
    this.id = apiData.id.toString();
    const brandAndModel = apiData.brandWithModel.split(" ");
    this.brand = brandAndModel[0].charAt(0).toUpperCase() + apiData.slice(1);
    this.model = brandAndModel[1];
    this.launchDate = new Date(apiData.launch_date);
}
```
