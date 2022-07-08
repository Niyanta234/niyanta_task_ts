class ApiFeatures {
    query: any;
    queryStr: any;
    constructor(query:any, queryStr:any) {
        this.query = query;
        this.queryStr = queryStr;
    }
    pagination(resultPerPage:any) {
        const currentPage = Number(this.queryStr.page) || 1; // product 50 1page = 10product
        // 1st page 10 * 1-1 = 10*0=0 skip
        // 2nd page 10 * 2-1 = 10*1=10 skip show 11 to 20
        // 3rd page 10 * 3-1 = 10*=2=20 skip show 21 to 30

        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}
export default ApiFeatures;
