codeError = ["400", "401", "403", "404", "405", "500"]

codeStatus = {
	"200": "Ok",
	"201": "Created",
	"202": "Accepted",
	"204": "Succeeded No Data",
	"400": "Bad Request",
	"401": "Unauthorized",
	"403": "Forbidden",
	"404": "Not Found",
	"405": "Method Not Allowed",
	"500": "Server Error",
}

codeReason = {
	"200": "The request has succeeded.",
	"201": "The request has been fulfilled and resulted in a new resource being created.",
	"202": "The request has been accepted for processing, but the processing has not been completed.",
	"204": "The request has succeeded, no data available",
	"400": "The request is invalid.",
	"401": "The request requires authentication, or your authentication was invalid.",
	"403": "You are authenticated, but do not have permission to access the resource.",
	"404": "The resource does not exist.",
	"405": "The method is not allowed for requested URL",
	"500": "Service unavailable, try again later.",
}


resp = function (res, code, data) {
    //create response data
    var resp = {
        code: code,
        status: codeStatus[""+code],
	};
	


    if (codeError[""+code]) {
        resp["reason"] = codeReason[""+code];
    } else {
        //if data exists -> add to response body object
        if (data && typeof data != "undefined") {
            resp["data"] = data;
        }
    }

    res.status = code;
    return res.end(JSON.stringify(resp));
}