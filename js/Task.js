class Task{
    constructor (id,userId, title, description,dueDate){
        this.id=id;
        this.userId =userId;
        this.title=title;
        this.description=description||" ";
        this.status="pending";
        this.dueDate=dueDate||null;
    this.createdAt=new Date().toISOSString();
        
    }
}