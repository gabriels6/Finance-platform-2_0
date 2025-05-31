export default {
    formatDate(date = new Date()) {
        if(date instanceof Date)
            return date.toLocaleDateString().split("/").reverse().join("-")
        return null;
    }
}