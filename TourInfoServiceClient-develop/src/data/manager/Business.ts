export type Business = {
  request_cnt: number
  match_cnt: number
  status_code: string
  data: BusinessData[]
}

export type BusinessData = {
  b_no: string
  b_stt: string
  b_stt_cd: string
  tax_type: string
  tax_type_cd: string
  end_dt: string
  utcc_yn: string
  tax_type_change_dt: string
  invoice_apply_dt: string
  rbf_tax_type: string
  rbf_tax_type_cd: string
}
