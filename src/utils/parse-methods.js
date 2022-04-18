export default {
    parseJSONWithNumbers(array) {
        return array.map((item) => {

            let parsedObject = Object.entries(item).map((value,index) => {
                if(value[0].includes("."))
                    return [ value[0].split(".")[1].trim(), value[1]]
                return [ value[0], value[1]]
            });

            return Object.fromEntries(new Map(parsedObject));
        })
    }
}