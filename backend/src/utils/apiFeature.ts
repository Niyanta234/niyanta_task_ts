class ApiFeatures {
    query: any;
    queryStr: any;
    constructor(query:any, queryStr:any) {
        this.query = query;
        this.queryStr = queryStr;
    }
    pagination(resultPerPage:any) {
        const currentPage = Number(this.queryStr.page) || 1; 
        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}
export default ApiFeatures;
