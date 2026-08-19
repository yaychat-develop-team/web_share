import thinkingdata from 'thinkingdata-browser'

export type ThinkingDataAutoTrackConfig = {
  pageShow?: boolean
  pageHide?: boolean
}

export type ThinkingDataInitConfig = {
  appId: string
  serverUrl: string
  batch?: boolean
  showLog?: boolean
  autoTrack?: ThinkingDataAutoTrackConfig
}

const config: ThinkingDataInitConfig = {
  appId: import.meta.env.VITE_THINKINGDATA_APPID,
  serverUrl: import.meta.env.VITE_THINKINGDATA_SERVER_URL,
  batch: false,
  showLog: false,
  // autoTrack: {
  //   pageShow: true,
  //   pageHide: true,
  // },
}

thinkingdata.init(config)

thinkingdata.setSuperProperties({
  x_region: import.meta.env.VITE_THINKINGDATA_REGION || 'us',
})

export const ta = thinkingdata
