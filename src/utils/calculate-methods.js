export default {
    calculateAmount(assets) {
        return assets.map((asset) => {
            return {
                ...asset,
                amount: (asset.quantity * asset.value)
            }
        })
    },
    calculatePercentage(assets) {
        let totalQuantity = assets.reduce((prevValue, item) => {
            return prevValue + item.quantity
        }, 0.0);

        return assets.map((asset) => {
            return {
                ...asset,
                percentage: (asset.quantity/totalQuantity) * 100
            }
        })
    }
}