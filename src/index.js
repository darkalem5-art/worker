export default {
  async fetch(request, env, ctx) {
    const TARGET = "https://casibom.com";
    const url = new URL(request.url);

    // proxyalaniniz.com yerine kendi domainini yaz
    const PROXY_DOMAIN = "proxyalaniniz.com"; // BURAYI DEĞİŞTİR

    url.hostname = "casibom.com";
    url.protocol = "https:;

    let newRequest = new Request(url.toString(), request);
    
    // Host header’ını doğru siteye yönlendir
    newRequest.headers.set("Host", "casibom.com");

    let response = await fetch(newRequest, {
      redirect: "manual"
    });

    // Cloudflare, aynı response’u kopyala
    let newResponse = new Response(response.body, response);
    
    // CORS aç (isteğe bağlı)
    newResponse.headers.set("Access-Control-Allow-Origin", "*");
    
    // Güvenlik ve çerez temizliği
    newResponse.headers.delete("Set-Cookie");
    newResponse.headers.delete("Set-Cookie-Domain");

    // HTML sayfalarındaki mutlak linkleri proxy domain’e çevir
    if (newResponse.headers.get("content-type")?.includes("text/html")) {
      let text = await newResponse.text();
      text = text
        .replace(/https:\/\/casibom\.com/g, `https://${PROXY_DOMAIN}`)
        .replace(/https:\/\/www\.casibom\.com/g, `https://${PROXY_DOMAIN}`)
        .replace(/\/\/casibom\.com/g, `//${PROXY_DOMAIN}`);
      newResponse = new Response(text, { ...newResponse, body: text });
    }

    return newResponse;
  }
};
