const Blog = require('../models/blog')

exports.createBlog = async(req,res)=>{
    const{title,author,content,imageUrl,tags,categories}=req.body
    if(!title || !author || !content || !imageUrl){
        res.status(400).json({msg:"All Field is required"})
    }
    try {
       const blog = new Blog({
        title,
        author,
        content,
        imageUrl,
        tags,
        categories,
       })
       await blog.save()
       res.status(201).json(blog)
       console.log(blog)
    } catch (err) {
       console.log("create blog:",err.message);
       res.status(500).send('cannot create blog');
    }
}

exports.getAllBlogs = async(req,res)=>{
    try {
        const blogs = await Blog.find({})
        res.status(200).json(blogs)
    } catch (err) {
        console.log("error : ",err)
        res.status(500).send('cannot find all blogs')
    }
}

exports.recentPosts = async (req, res) => {
    try {
      // Use the Blog model instead of BlogPost
      const recentPosts = await Blog.find().sort({ createdAt: -1 }).limit(2)
      res.status(200).json(recentPosts);
    } catch (err) {
      console.error("Error fetching recent posts:", err.message);
      res.status(500).json({ message: "Cannot find recent posts" });
    }
  };
  
exports.getBlogById = async(req,res)=>{
    try {
        const blog = await Blog.findById(req.params.id)
        if(!blog){
            return res.status(404).json({msg:"  BlogById not found"})
        }
        res.status(200).json(blog)
    } catch (err) {
        console.log("error : ",err)
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg:"  cannot get BlogById  Blog not found"})
        }
        res.status(500).send('cannot find blog')
    }
}

exports.deleteBlogbyId = async(req,res)=>{
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id)
        if(!blog){
            return res.status(404).json({msg:"Blog not found"})
        }
        res.json({msg:"Blog deleted successfully"})
    } catch (err) {
        console.log("error : ",err)
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg:"Blog not found"})
        }
        res.status(500).send('cannot delete blog')
    }
}

exports.updateBlogById = async(req,res)=>{
    const {title,author,content,imageUrl,tags,categories}=req.body
    if(!title ||!author ||!content ||!imageUrl){
        res.status(400).json({msg:"All Field is required"})
    }
    try {
        let blog = await Blog.findByIdAndUpdate(req.params.id,{
            title,
            author,
            content,
            imageUrl,
            tags,
            categories,
        },{new:true})
        if(!blog){
            return res.status(404).json({msg:"Blog not found"})
        }
        res.json(blog)
    } catch (err) {
        console.log("error : ",err)
        res.status(500).send('cannot update blog')
    } 
}

// exports.searchBlogByTitle = async (req, res) => {
//     const { title } = req.params; // If using the URL parameter approach

//     try {
//         const regex = (title); // 'i' makes the search case
//         console.log('Constructed regex:', regex); // Debugging statement


//         console.log('Incoming title:', title); // Debugging statement
//         const blog = await Blog.findOne({ title : regex });
//         if (!blog) {
//             return res.status(404).json({ msg: 'Blog not found123' });
//         }
//         res.status(200).json(blog);
//     } catch (err) {
//         console.log(err.message);
//         res.status(500).send('Server error');
//     }  
// };
