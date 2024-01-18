const blogContent = `Welcome to our Technology Hub! Stay up-to-date with the latest tech trends, expert insights,
                    and unbiased product reviews. Join our community of tech enthusiasts and professionals.
                    Discover the transformative power of technology and its impact on society. Interested in
                    contributing? Contact us at theinfowheels@gmail.com Let's explore the exciting world of
                    technology together.

                    In an increasingly interconnected world, 5G technology has emerged as a game-changer,
                    promising lightning-fast speeds, ultra-low latency, and revolutionary capabilities. In this
                    guest post, we explore the rise of 5G technology and its transformative impact across
                    various sectors, from communication and transportation to entertainment and beyond. Join us
                    as we delve into the exciting possibilities and discuss how 5G is reshaping our digital
                    landscape.

                    5G technology is revolutionising communication by enabling faster, more reliable,
                    and ubiquitous connectivity. From high-definition video calls and seamless streaming to
                    real-time collaboration and immersive virtual experiences, 5G is breaking barriers
                    and bringing us closer together. Discover how this next-generation network is paving
                    the way for innovative communication solutions and driving the evolution of the
                    digital ecosystem.

                    The Internet of Things (IoT) is poised to flourish with the advent of 5G. With its
                    ability to connect an unprecedented number of devices simultaneously, 5G facilitates
                    the seamless exchange of data, enabling smart cities, intelligent transportation
                    systems, and interconnected smart homes. Explore how 5G is empowering the IoT
                    revolution, transforming the way we interact with technology and our surroundings..

                    5G technology is not just about faster download speeds; it holds the potential to
                    revolutionise industries across the board. From healthcare and manufacturing to
                    logistics and entertainment, 5G is driving innovations that enhance efficiency,
                    productivity, and customer experiences. Uncover the profound impact of 5G in
                    different sectors and discover how it is propelling us into a new era of digital
                    transformation.

                    One of the most promising applications of 5G lies in the realm of autonomous
                    transportation. With its ultra-low latency and high reliability, 5G is the key to
                    unlocking the full potential of self-driving cars, smart traffic management, and
                    connected transportation systems. Learn how this technology is poised to reshape the
                    way we travel and revolutionise the future of mobility.

                    As 5G technology continues to roll out across the globe, we stand on the brink of a
                    new era of connectivity and possibilities. From transforming communication and
                    powering the IoT to revolutionising industries and enabling autonomous
                    transportation, 5G is set to redefine how we live, work, and interact with the world
                    around us. Join us as we embrace this exciting journey into the future and explore
                    the boundless potential of 5G technology.
                    `;

// Split the content into paragraphs
const paragraphs = blogContent.split("\n\n");

// Calculate the number of images based on the number of paragraphs
let numImages = 0;
if (paragraphs.length >= 8) {
  numImages = 2;
} else if (paragraphs.length >= 5) {
  numImages = 1;
}

// Create the blog object with the required properties
const blog = {
  title: "Your Blog Title",
  body: "", // Will be populated later
  date: "2023-06-16",
  category: "Technology",
  titleImage: "images/img_3_horizontal.jpg",
  bodyImage1: numImages >= 1 ? "images/img_2_horizontal.jpg" : "",
  bodyImage2: numImages >= 2 ? "images/img_3_horizontal.jpg" : "",
};

// Iterate over the paragraphs and split into <p> tags with a maximum of 50 words each
let bodyContent = "";
let wordCount = 0;
for (let i = 0; i < paragraphs.length; i++) {
  const paragraph = paragraphs[i].trim();
  const words = paragraph.split(" ");

  // Check if adding this paragraph would exceed the word count limit
  if (wordCount + words.length > 50) {
    break; // Stop adding paragraphs if the word count limit is reached
  }

  bodyContent += `<p>${paragraph}</p>`;
  wordCount += words.length;
}

blog.body = bodyContent;

console.log("blog: ", bodyContent);

// Now you can save the 'blog' object to your database
