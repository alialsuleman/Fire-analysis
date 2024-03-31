
const  { initDb, db } =require('../index')
//import { Post, User, Comment, Like } from "../../types";

/**
 *       user testing : 
 * 
     * - createUser          👍
     *    - getUserByEmail      👍
     *    - getUserByUserName   👍
     *    - updateCurrentUser   👍
     *    - getUserById         👍
     *    - deleteUser          👍
 */
// @ts-ignore
test("test create user" ,async ()=>{
    let user1 = {
        id: "12323123",
        userName: "ali123",
        email: "ali@gmail2.com",
        firstName: "ali",
        lastName: "alsuleman",
        password: "ali.123"
    }
    try {
        await initDb();
        await db.createUser(user1);
    } catch (e) {
        console.log(e)
        // @ts-ignore
        expect(e).toMatch('error');
    }
}) 














    /**
     *    USER : 
     *    - createUser          👍
     *    - getUserByEmail      👍
     *    - getUserByUserName   👍
     *    - updateCurrentUser   👍
     *    - getUserById         👍
     *    - deleteUser          👍
     * 
     *    POST :
     *    - listPosts    👍
     *    - createPost   👍
     *    - getPost      👍
     *    - deletePost   👍
     *  
     *   COMMENT  :
     *   - createComment    👍
     *   - listComment      👍
     *   - deleteComment    👍
     * 
     *   LIKE :
     *   - createLike    👍
     *   - listLike      👍
     *   - deleteLike    👍
     * 
     */
    
    // let user1 = {
    //     id: "12323123",
    //     userName: "ali123",
    //     email: "ali@gmail2.com",
    //     firstName: "ali",
    //     lastName: "alsuleman",
    //     password: "ali.123"
    // }
    // let user2: User = {
    //     id: "1243212312",
    //     userName: "ahmad",
    //     email: "ahmad@gmail2.com",
    //     firstName: "ahmad",
    //     lastName: "ahmad",
    //     password: "ahmad.123"
    // }
    // let user3: User = {
    //     id: "12512321",
    //     userName: "saly",
    //     email: "saly@gmail2.com",
    //     firstName: "saly",
    //     lastName: "alsuleman",
    //     password: "saly.123"
    // }
    // let user4: User = {
    //     id: "126",
    //     userName: "lara",
    //     email: "lara@gmail2.com",
    //     firstName: "lara",
    //     lastName: "alsuleman",
    //     password: "lara.123"
    // }

    // // await db.createUser(user1);
    // // await db.createUser(user2);
    // // await db.createUser(user3);
    // // await db.createUser(user4);

    // let post1: Post = {
    //     id: "123123",
    //     title: "hello world",
    //     postedAt: Date.now(),
    //     url: "www.google.com/123123",
    //     userId: "126"
    // }
    // let post2: Post = {
    //     id: "123124",
    //     title: "hello world 2",
    //     postedAt: Date.now(),
    //     url: "www.google.com/2",
    //     userId: "126"
    // }
    // let post3: Post = {
    //     id: "123125",
    //     title: "hello world v3",
    //     postedAt: Date.now(),
    //     url: "www.google.com/123",
    //     userId: "126"
    // }


    // await db.createPost(post1)
    // await db.createPost(post2)
    // await db.createPost(post3)

    //await db.deletePost("123123")
    //console.log(await db.listPosts());
    //console.log("****")
    //console.log(await db.getPost("123124"));
    //console.log(await db.getUserByEmail("ali@gmail.com"));
    //console.log(await db.getUserById("126"));
    //console.log(await db.getUserByUserName("lara"));
    //await db.deleteUser("5ae18ea9-61dd-4d72-9193-310a1c8fa1e4")

    // const c1: Comment = {
    //     id: "123",
    //     userId: "126",
    //     postId: "12",
    //     comment: "hiiii ",
    //     postedAt: Date.now()
    // }
    // //await db.createComment(c1);
    // //console.log(await db.listComment("12"));
    // //await db.deleteComment("123");

    // const like1: Like = {
    //     userId: "126",
    //     postId: "123"
    // }
    //await db.createLike(like1);
    //console.log(await db.listLike("12"))
    // await db.deleteLike("126", "12")



