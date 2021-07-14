export class datamodel
{
	responses: [string];
    text: []
	constructor(obj: any = null)
	{
		if(obj != null)
		{
			Object.assign(this, obj);
		}
	}
}