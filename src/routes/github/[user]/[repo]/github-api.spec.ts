import { describe, it, vi } from "vitest";
import { Fetch, GithubApi } from "./github-api";

function getMockPromise<T = unknown>(): Promise<T> & {
  resolve: (value: T) => void;
  reject: (error: any) => void;
} {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  }) as any;

  promise.resolve = resolve;
  promise.reject = reject;
  return promise;
}

describe("github-api", () => {
  describe("getRepository", () => {
    it("should return repository information", async ({ expect }) => {
      const fetch = vi.fn<Parameters<Fetch>, ReturnType<Fetch>>(getMockPromise);

      const api = new GithubApi("TOKEN", fetch);
      const responsePromise = api.getRepository("USERNAME", "REPOSITORY");

      expect(fetch).toHaveBeenCalledWith(
        "https://api.github.com/repos/USERNAME/REPOSITORY",
        {
          headers: {
            "User-Agent": "Qwik Workshop",
            "X-GitHub-Api-Version": "2022-11-28",
            Authorization: "Bearer TOKEN",
          },
        },
      );

      fetch.mock.results[0].value.resolve(new Response('"BLAH"'));
      expect(await responsePromise).toEqual("BLAH");
    });

    it.skip("should timeout after x seconds with time out response");
  });
});
