const IMAGES_UPLOAD_DEFAULT_EXTENSIONS = ['jpg', 'jpeg', 'png'];
const DOC_UPLOAD_DEFAULT_EXTENSIONS = ['pdf', 'docs'];
const CSV_UPLOAD_DEFAULT_EXTENSIONS = ['csv'];
const ALLOWED_FILE_TYPES = {
    IMAGES: 'images',
    DOCS: 'docs',
    IMAGES_DOCS: 'images_docs',
    CSV: 'csv'
};
module.exports = {
    IMAGES_UPLOAD_DEFAULT_EXTENSIONS,
    DOC_UPLOAD_DEFAULT_EXTENSIONS,
    CSV_UPLOAD_DEFAULT_EXTENSIONS,
    ALLOWED_FILE_TYPES
};
