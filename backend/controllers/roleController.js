const roleModel = require("../models/rolesSchema");

const addNewRole = async(req,res) => {
    const {role, permissions} = req.body;
    const newRole = new roleModel({role, permissions});
    try {
        const result = await newRole.save();
        res.status(201).json({
            success: true,
            message: "Role Created",
            role: result
        })
    } catch (error) {
        res.json(error);
    }
}

module.exports = {
    addNewRole
}