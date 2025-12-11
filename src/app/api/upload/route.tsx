export async function POST(req: Request) {
    interface JsonResponse {
        uri: string
    }

    try {
        const form = await req.formData();
        const file = form.get("file") as File;

        if (!file) {
            return new Response(JSON.stringify({ error: "No file provided" }), {
                status: 400
            })
        }

        const uploadForm = new FormData();
        uploadForm.append("reqtype", "fileupload");
        uploadForm.append("fileToUpload", file);


        const res = await fetch("https://catbox.moe/user/api.php", {
            method: 'POST',
            body: uploadForm
        })

        const text = res.text();

        return new Response(JSON.stringify({ "uri": text }), {
            status: 200,
            headers: {
                "content-Type": "applicaton/json"
            }
        })
    } catch (error) {
        return new Response(JSON.stringify({ "error": "some error occured" }), {
            status: 400
        })
    }
}