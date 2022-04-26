export class Shippment {
    id: number;
    shippmentNo: string;
    delivery_address: string;
    status: number;
    description: string;

    /**
     * Constructor
     *
     * @param shippment
     */
    constructor(shippment?)
    {
        shippment = shippment || {};
        this.id = shippment.id || '';
        this.delivery_address = shippment.delivery_address || '';
        this.shippmentNo = shippment.shippmentNo || '';
        this.description = shippment.description || '';
        this.status = shippment.status || 1;
    }

}
