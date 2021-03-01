import {PoolInteraction} from './PoolInteraction'

export class PoolTest extends PoolInteraction{
    protected static instance: PoolTest|undefined = undefined

    constructor(){
        super()
        this.callTestingEvent()
    }

    private callTestingEvent(): void{
        before(async () => {
           await this.pool.query("BEGIN")
        })
        after(async () => {
            await this.pool.query("ROLLBACK")
        })
    }
}