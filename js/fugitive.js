class Fugitive {
    constructor(id, name, description, riskLevel, status, creatorOfficerId) {
        this.id = id;
        this.name = name;
        this.description = description || " ";
        this.status = "";
        this.riskLevel = riskLevel;
        this.relatedOfficerIds = [creatorOfficerId];
    }
}