const adminAuth = (req,res, next) => {
    console.log("admin auth middleware");
    const token = "xyz";
    const adminAuthentication = token === "xyz";

    if(!adminAuthentication){
        res.status(401).send("Unauthorized");
    }
    else {
        next();
    }
}

module.exports = {adminAuth};