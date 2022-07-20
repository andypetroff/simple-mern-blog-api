export const env = {
    app_name: 'Simple MERN Blog API',

    // connections
    mongodb: process.env.MONGODB_URI,
    port: process.env.PORT || 4444,

    // folder name != path
    upload_folder_name: 'uploads',

    // cloudinary
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
}
