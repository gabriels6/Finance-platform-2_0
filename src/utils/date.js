export default {
    formatDate(date = new Date()) {
        return date?.toLocaleDateString()?.split("/")?.reverse()?.join("-")
    }
}