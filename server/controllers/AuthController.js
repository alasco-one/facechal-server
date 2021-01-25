var md5 = require("md5")

exports.authController = {
    /**
     * Methode qui permet de controller l'authentification
     * Elle retourne une promesse qui permet d'indiquer si le user est correct ou 
     * pas
     */
    check : function  ( credential, db ) {
        credential.password = md5(credential.password)
        //console.log(credential);
        return new Promise((resolve, reject)=>{
            db.collection("users").find(credential).toArray()
                .then( rows => (rows.length > 0) ? resolve(rows[0]) : reject() )
                .catch(err => reject(err))

        })
    },
    /**
     * Methode qui permet d'enrigistrer un nouveau utilisateur
     */
    register : function( user, db ){
        user.password = md5(user.password)

        delete user.confirmingPassword

        //console.log(user);
        return new Promise((resolve, reject)=>{
            db.collection("users").insertOne(user)
                .then( () => resolve(true) )
                .catch( err => reject(err) )

        })
    }
}

