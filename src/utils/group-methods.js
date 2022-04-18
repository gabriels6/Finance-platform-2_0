export default {
    groupAssetsByType(assets){
        // Create an array of types with quantity
        let assetTypes = assets.reduce((prevValue, item, index) => {
            if (prevValue.includes(item.type)) return prevValue
            return [...prevValue, item.type];
        },[]);

        assetTypes = assetTypes.map((item) => {
            return {
                type: item,
                quantity: 0,
            };
        });

        assets.forEach((asset) => {
            assetTypes.forEach((item) => {
                if (asset.type === item.type) {
                    item.quantity += asset.quantity;
                }
            });
        });

        return assetTypes;
    },
    groupAssetHist(assetValueHist) {
        return assetValueHist.reduce((prevValue, item) => {
            let dateFound = false;
            prevValue.forEach((asset) => {
                if (asset.date === item.date) dateFound = true;
            });

            if(dateFound === false) {
                let valueObject = {
                    date: item.date,
                }
                valueObject[item.asset.symbol] = item.price
                prevValue.push(valueObject)
            } else {
                prevValue.forEach((value) => {
                  if (value.date === item.date) value[item.asset.symbol] = item.price;  
                });
            }
            return prevValue.sort((item, nextItem) => {
                return item.date.localeCompare(nextItem.date);
            });
        },[]);
    },
    groupAssetHistSecurities(assetValueHist) {
        return assetValueHist.reduce((prevValue, item, index) => {
            if (index === 0) return [item.asset.symbol]; 
            if (!prevValue.includes(item.asset.symbol)) prevValue.push(item.asset.symbol);
            return prevValue;
        }, []);
    }
}