from flask import *
from flask_cors import CORS
import json
import os
from openai import OpenAI

# 导入向量数据库（向量存储、查询）
from langchain.vectorstores import FAISS
# 导入langchain 文本拆分器
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceBgeEmbeddings

from langchain.document_loaders import TextLoader

# # 文档存放位置
# data_path = f"doc"
 
# documents = []
# # 指定要处理的文件类型
# file_types = ('.pdf', '.docx',".txt")
 
# # 处理文件  遍历目录 加载文件 最后扩展文档列表拿到documents
# for filename in os.listdir(data_path):
#     if filename.endswith(file_types):  # 如果你想加载其他类型的文件，可以修改此处
#         file_path = os.path.join(data_path, filename)
#         loader = TextLoader(file_path, encoding='utf-8')
#         docs = loader.load()
        
#         documents.extend(docs)

# # 将文档数据拆分为 chunk 的大小
# text_splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=50)
# all_splits = text_splitter.split_documents(documents)

# # 文本嵌入模型
# embedding_model = HuggingFaceBgeEmbeddings(
#     model_name="C:\\Users\\gfdydm\\Desktop\\mianshiya-next-master\\ai-backend\\modelscope\\hub\\models\\AI-ModelScope\\bge-large-zh-v1___5")
 
# # 将文本编码为向量，并保存为向量
# # normalize_L2=True表示向量进行L2归一化 是一种检索方式
# vectorstore = FAISS.from_documents(
#     documents=all_splits,
#     embedding=embedding_model,
#     normalize_L2=True,
# )
# vectorstore.save_local(f"faiss")

embedding_model = HuggingFaceBgeEmbeddings(model_name="C:\\Users\\gfdydm\\Desktop\\mianshiya-next-master\\ai-backend\\modelscope\\hub\\models\\AI-ModelScope\\bge-large-zh-v1___5")
 
vectorstore = FAISS.load_local(f"faiss", embedding_model, allow_dangerous_deserialization=True)
        # 创建检索器
retriever = vectorstore.as_retriever(search_type="similarity_score_threshold", search_kwargs={"score_threshold":0.1,"k":2})

app = Flask(__name__)

client = OpenAI(
    # 若没有配置环境变量，请用百炼API Key将下行替换为：api_key="sk-xxx",
    api_key="sk-bb901ef8d7e44cb0be1c535e137974c4",
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
)


def call_model_api(question):
    completion = client.chat.completions.create(
        model="qwen-turbo",  # 模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
        messages=[
            {'role': 'system', 'content': 'You are a helpful assistant.'},
            {'role': 'user', 'content': question}
            ],
            temperature=0.7
    )
    return completion.choices[0].message.content
print(call_model_api("你好"))
@app.route("/")
def hello():
    return "Hello World!"

@app.route("/api/v1/chat", methods=["POST"])
def chat():
    data = json.loads(request.data)
    question = data.get("question")
    
    related_docs = retriever.get_relevant_documents(question)
    #把related_docs拼接成context
    context = ""
    for doc in related_docs:
        context += doc.page_content + "\n"
    template = f"""以context为基础回答问题:
          {context}
        
          Question: {question}
          """
    answer = call_model_api(template)
    return jsonify({"answer": answer}),200

@app.route("/api/v1/mianshi", methods=["POST"])
def mianshi():
    # 定义一个数组，难度分成五级
    levels = ["简单", "一般", "中等", "困难", "极难"]
    data = json.loads(request.data)
    question = data.get("question")
    answer = data.get("answer")
    level = data.get("level")
    topic = data.get("topic")
    print(question)
    print(answer)
    print(level)
    print(topic)
    if not question:
        # 
        template=f"""
            请给出一个难度为{levels[level]}的{topic}方面的面试问题，尽可能简洁易懂,请不要输出markdown格式的回答，我的前端页面不支持markdown文本的显示
            """
        question= call_model_api(template)
        return jsonify({"question": question}),200
    else:
        completion = client.chat.completions.create(
        model="qwen-plus",
        messages=[
            {
                "role": "system",
                "content": """你需要判断答案是否正确 value(返回值  为bool类型 true为正确，false为错误)，请输出JSON 字符串，不要输出其它无关内容。
            示例：
            Q：问题：1+2=？ 答案：1+2=5
            A：{"value":False}
            Q：问题：c++是什么类型的语言？答案：c++是编译型语言。
            A：{"value":True}"""
            },
            {
                "role": "user",
                "content": f"""问题：{question}  答案：{answer}""",
            },
            
        ],
        response_format={"type": "json_object"},
        temperature=0.7
    )
        # 步骤 2：解析 JSON 字符串。请将以下代码添加到步骤 1 之后
        json_string = completion.choices[0].message.content

        json_object = json.loads(json_string)
        for key, value in json_object.items():
            print(f"{key} 为 {value}")
        value = json_object.get("value")
        if value:
            level+=1
        if level >= 4:
            level=4
        template=f"""
            请给出一个难度为{levels[level]}的{topic}方面的面试问题，尽可能简洁易懂,请不要输出markdown格式的回答，我的前端页面不支持markdown文本的显示
            """
        question= call_model_api(template)
        return jsonify({"ispass":value==True,"question":question}),200

    
    
    


CORS(app, resources=r'/*')
if __name__ == "__main__":
    app.run(debug=False,port=5001)