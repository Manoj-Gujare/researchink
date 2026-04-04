export interface Reference {
  title: string;
  url: string;
  type: "web" | "arxiv";
}

export interface Section {
  heading: string;
  content: string;
  generate_image: boolean;
  key_insight: string;
  sources: string[];
  image_b64?: string;
}

export interface Intro {
  hook: string;
  context: string;
  what_you_will_learn: string;
}

export interface Conclusion {
  summary: string;
  forward_look: string;
}

export interface BlogPost {
  title: string;
  subtitle: string;
  hero_image: boolean;
  hero_image_b64?: string;
  reading_time: string;
  tags: string[];
  intro: Intro;
  sections: Section[];
  key_takeaways: string[];
  conclusion: Conclusion;
  references: Reference[];
}
