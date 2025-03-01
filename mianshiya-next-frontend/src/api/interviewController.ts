// @ts-ignore
/* eslint-disable */
import request from "@/libs/request";

/** addInterview POST /api/interview/add */
export async function addInterviewUsingPost(
  body: API.InterviewAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>("/api/interview/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** editInterview POST /api/interview/edit */
export async function editInterviewUsingPost(
  body: API.InterviewEditRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/interview/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** getInterviewVOById GET /api/interview/get/vo */
export async function getInterviewVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getInterviewVOByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseInterviewVO_>("/api/interview/get/vo", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listInterviewVOByPage POST /api/interview/list/page/vo */
export async function listInterviewVoByPageUsingPost(
  body: API.InterviewQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageInterviewVO_>(
    "/api/interview/list/page/vo",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** listMyInterviewVOByPage POST /api/interview/my/list/page/vo */
export async function listMyInterviewVoByPageUsingPost(
  body: API.InterviewQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageInterviewVO_>(
    "/api/interview/my/list/page/vo",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}
