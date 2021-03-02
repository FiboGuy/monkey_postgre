import * as fs from 'fs'

export function createSchemaSql(baseDir?: string, outDir?: string):void
{
    if(!baseDir || !outDir){
        console.log('Missing args baseDir and/or outDir')
        process.exit(1)
    }
    
    let models: string[]
    if(fs.lstatSync(baseDir).isDirectory()){
        models = getAllModelsInDirectory(baseDir)   
    }
    else{
        console.log('baseDir not a directory')
        process.exit(1)
    }

    models.forEach(e => {
        const model:any = Object.values(require(e))[0]
        try{
            fs.appendFileSync(outDir as string, model.getSchema() + '\n', )
        }catch(err){
            console.log(err.message)
            process.exit(1)
        }   
    })
}

function getAllModelsInDirectory(dir: string): Array<string>
{
    const models:Array<string> = []
    if(fs.lstatSync(dir).isDirectory()){
        fs.readdirSync(dir).forEach(e => {
            models.push(...getAllModelsInDirectory(`${dir}/${e}`))
        })
    }else if(fs.lstatSync(dir).isFile()){
        if((/.+\.Model\.ts/).test(dir)){
            models.push(dir)
        }
    }

    return models
}

function getArgs(): {baseDir: string, outDir: string}| {}{
    const args = process.argv.filter(e =>  {
        return e.indexOf('--') === 0
    })

    const result = {}

    args.forEach(e => {
        const element = e.replace('--', '').split('=')
        result[element[0]] = element[1]
    })

   
    return result
}

const args = getArgs()
if('baseDir' in args && 'outDir' in args){
    createSchemaSql(args['baseDir'], args['outDir'])
}
