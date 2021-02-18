import * as fs from 'fs'

export function createSchemaSql(baseDir?: string, outDir?: string):void
{
    if(baseDir === undefined || outDir === undefined){
        ;({baseDir, outDir} = getArgs())
    }

    const models = getAllModelsInDirectory(baseDir as string)
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
    }else{
        console.log('baseDir not a directory')
        process.exit(1)
    }

    return models
}

function getArgs(): {baseDir: string, outDir: string}{
    const args = process.argv.filter(e =>  {
        return e.indexOf('--') === 0
    })

    const result = {}

    args.forEach(e => {
        const element = e.replace('--', '').split('=')
        result[element[0]] = element[1]
    })

    if(result['baseDir'] && result['outDir']){
        return result as {baseDir: string, outDir: string}
    }else{
        console.log('Missing args baseDir and/or outDir')
        process.exit(1)
    }
}