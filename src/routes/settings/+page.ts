import { invoke } from "@tauri-apps/api/core"

export const load = async ({ depends }) => {
	depends("executable:paths")
	const promises = await Promise.all([
		invoke("get_executable_path", { exe: "simba1400" }) as Promise<string>,
		invoke("get_executable_path", { exe: "simba2000" }) as Promise<string>,
		invoke("get_executable_path", { exe: "legacy" }) as Promise<string>,
		invoke("get_executable_path", { exe: "runelite" }) as Promise<string>,
		invoke("get_executable_path", { exe: "osclient" }) as Promise<string>
	])

	return {
		simba1400: promises[0],
		simba2000: promises[1],
		legacy: promises[2],
		runelite: promises[3],
		osclient: promises[4]
	}
}
