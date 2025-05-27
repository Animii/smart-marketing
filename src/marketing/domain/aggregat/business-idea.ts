export class BusinessIdea {
	private constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly url: string,
		public readonly description: string,
		public readonly createdAt: Date = new Date(),
		public readonly updatedAt: Date = new Date(),
	) {}

	static create(id: string, name: string, url: string, description: string) {
		return new BusinessIdea(id, name, url, description);
	}
}
