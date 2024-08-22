
export interface NDBRespone {
    result: "fail"|"success"|"exist"|"non-exist"|"NON_EXIST"|"ALREADY_EXIST";
    cause: string;
}