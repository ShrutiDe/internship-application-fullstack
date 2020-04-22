

const URI = "https://cfw-takehome.developers.workers.dev/api/variants";


addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Title text
 */
class TitleWriter {
  element(element) {
    element.setInnerContent("Shruti Desai");
  }
}

/**
 * Description text
 */
class DescriptionWriter {
  element(element) {
    element.setInnerContent('Please click on below link');
  }
}
/**
 * URL text
 */
class URLWriter {
  element(element) {
    element.setAttribute('href', 'https://www.linkedin.com/in/shruti-desai-90277b135/');
    element.setInnerContent('LinkedIn Profile');
  }
}

/**
 * Editing the text to display on webpage
 */
function responseWriter (result_op){

  var responseWriter=new HTMLRewriter()
  .on('title', new TitleWriter())
  .on('h1[id="title"]', new TitleWriter())
  .on('p[id="description"]', new DescriptionWriter())
  .on('a[id="url"]', new URLWriter())
  .transform(result_op);

  return responseWriter
} 

/**
 * Fetching variants from URL
 */
async function loadVariants(url) {
  var response = await fetch(url);
  var response_json = await response.json();
  return response_json;
}

var unique

/**
 * Setting cookie login
 */
function cookieFunction(head_cookie,unique){
  if (head_cookie) {
    let array_cookie = head_cookie.split(';')
    for (let cookie of array_cookie) {
      cookie = cookie.trim()
      if (cookie.startsWith("value=")) {
        unique = cookie.substring("value=".length)
        break
      }
    }
  }
}

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {

  
  var head_cookie = request.headers.get('Cookie')

  cookieFunction(head_cookie,unique);

  if (!unique) {

  let response = await loadVariants(URI);
    let selected = Math.random() > 0.5 ? 1 : 0;
    unique = response.variants[selected];
  }

    let result_op = await fetch(unique);
    var new_result_op = responseWriter(result_op);
    new_result_op.headers.set("Set-Cookie", "value="+unique);
    return new_result_op
}