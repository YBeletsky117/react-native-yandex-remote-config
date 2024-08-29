import YandexMobileMetrica
import Varioqub
import MetricaAdapterReflection

@objc(BRNYandexRemoteConfig)
class BRNYandexRemoteConfig: NSObject {

    static func createVarioqubConfigFromJSObject(jsObject: NSDictionary) -> VarioqubConfig {
        var vqCfg = VarioqubConfig.default

        if let baseURLString = jsObject["baseURL"] as? String,
           let baseURL = URL(string: baseURLString) {
            vqCfg.baseURL = baseURL
        }

        if let settings = jsObject["settings"] as? VarioqubSettingsProtocol {
            vqCfg.settings = settings
        }

        if let network = jsObject["network"] as? NetworkRequestCreator {
            vqCfg.network = network
        }

        if let fetchThrottle = jsObject["fetchThrottle"] as? TimeInterval {
            vqCfg.fetchThrottle = fetchThrottle
        }

        if let clientFeatures = jsObject["clientFeatures"] as? [String: String] {
            vqCfg.initialClientFeatures = ClientFeatures(dictionary: clientFeatures)
        }

        if let varioqubQueue = jsObject["varioqubQueue"] as? DispatchQueue {
            vqCfg.varioqubQueue = varioqubQueue
        }

        if let outputQueue = jsObject["outputQueue"] as? DispatchQueue {
            vqCfg.outputQueue = outputQueue
        }

        return vqCfg
    }

    @objc func initialize(_ apiKey: NSString, config: NSDictionary,
                          withResolver resolve: @escaping RCTPromiseResolveBlock,
                          withRejecter reject: @escaping RCTPromiseRejectBlock) {
        do {
            let adapter = AppmetricaAdapter()
            let createdConfig = BRNYandexRemoteConfig.createVarioqubConfigFromJSObject(jsObject: config)
            let result: () = VarioqubFacade.shared.initialize(clientId: apiKey as String, config: createdConfig, idProvider: adapter, reporter: adapter)
            resolve(result)
        } catch {
            let error = NSError(domain: "BRNYandexRemoteConfig", code: 123, userInfo: [NSLocalizedDescriptionKey: "Initialization failed"])
            reject("INITIALIZATION_ERROR", "Error initializing", error)
        }
    }

    @objc func activateConfig(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        VarioqubFacade.shared.activateConfig {
            resolve("config successfull activated")
        }
    }

    @objc func fetchConfig(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        VarioqubFacade.shared.fetchConfig { status in
            print(status)
            switch status {
            case .success:
                resolve("success")
            case .throttled:
                resolve("throttled")
            case .cached:
                resolve("cached")
            case .error(let e):
                let error = NSError(domain: "BRNYandexRemoteConfig", code: 123, userInfo: [NSLocalizedDescriptionKey: "Error: \(e)"])
                reject("FETCH_CONFIG_ERROR", "Error fetching config", error)
            @unknown default:
                let error = NSError(domain: "BRNYandexRemoteConfig", code: 123, userInfo: [NSLocalizedDescriptionKey: "Unknown error"])
                reject("FETCH_CONFIG_ERROR", "Unknown option for status", error)
            }
        }
    }

    @objc func getString(_ flagName: NSString, defaultValue b: NSString,
                   withResolver resolve: @escaping RCTPromiseResolveBlock,
                   withRejecter reject: @escaping RCTPromiseRejectBlock) {
        let flagValue = flagName as String
        let flag: VarioqubFlag = VarioqubFlag(rawValue: flagValue)
        if flag != nil {
            let value = VarioqubFacade.shared.getString(for: flag, defaultValue: b as String)
            resolve(value)
        } else {
            let error = NSError(domain: "BRNYandexRemoteConfig", code: 123, userInfo: [NSLocalizedDescriptionKey: "Invalid flag name"])
            reject("INVALID_FLAG_NAME", "Invalid flag name", error)
        }
    }

    @objc func getInt(_ flagName: NSString, defaultValue b: NSNumber,
                   withResolver resolve: @escaping RCTPromiseResolveBlock,
                   withRejecter reject: @escaping RCTPromiseRejectBlock) {
        let flagValue = flagName as String
        let flag: VarioqubFlag = VarioqubFlag(rawValue: flagValue)
        if flag != nil {
            let value = VarioqubFacade.shared.getInt(for: flag, defaultValue: b as? Int)
            resolve(value)
        } else {
            let error = NSError(domain: "BRNYandexRemoteConfig", code: 123, userInfo: [NSLocalizedDescriptionKey: "Invalid flag name"])
            reject("INVALID_FLAG_NAME", "Invalid flag name", error)
        }
    }

    @objc func getDouble(_ flagName: NSString, defaultValue b: NSNumber,
                   withResolver resolve: @escaping RCTPromiseResolveBlock,
                   withRejecter reject: @escaping RCTPromiseRejectBlock) {
        let flagValue = flagName as String
        let flag: VarioqubFlag = VarioqubFlag(rawValue: flagValue)
        if flag != nil {
            let value = VarioqubFacade.shared.getDouble(for: flag, defaultValue: b as? Double)
            resolve(value)
        } else {
            let error = NSError(domain: "BRNYandexRemoteConfig", code: 123, userInfo: [NSLocalizedDescriptionKey: "Invalid flag name"])
            reject("INVALID_FLAG_NAME", "Invalid flag name", error)
        }
    }

    @objc func getBool(_ flagName: NSString, defaultValue b: NSNumber,
                   withResolver resolve: @escaping RCTPromiseResolveBlock,
                   withRejecter reject: @escaping RCTPromiseRejectBlock) {
        let flagValue = flagName as String
        let flag: VarioqubFlag = VarioqubFlag(rawValue: flagValue)
        if flag != nil {
            let value = VarioqubFacade.shared.getBool(for: flag, defaultValue: b as? Bool)
            resolve(value)
        } else {
            let error = NSError(domain: "BRNYandexRemoteConfig", code: 123, userInfo: [NSLocalizedDescriptionKey: "Invalid flag name"])
            reject("INVALID_FLAG_NAME", "Invalid flag name", error)
        }
    }

    @objc func getDeviceId(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {

        let vart = VarioqubFacade.shared.varioqubId
        if (vart != nil) {
            resolve(vart)
        } else {
            let error = NSError(domain: "BRNYandexRemoteConfig", code: 123, userInfo: [NSLocalizedDescriptionKey: "No value for deviceId"])
            reject("NO_VALUE", "No value for deviceId", error)
        }
    }
}
