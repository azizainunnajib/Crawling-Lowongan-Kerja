const axios = require('axios')
const fastcsv = require('fast-csv');
const fs = require('fs');
const cron = require('node-cron');
var exec = require('child_process').exec;
var dayjs = require('dayjs');
const { get } = require('lodash');
const instance = axios.create({
  baseURL: 'https://xapi.supercharge-srp.co/job-search/graphql?country=id&isSmartSearch=true',
  timeout: 100000
});

console.log('run');
// getHeaderJob()
crawlingDetailData()
cron.schedule('* * * * *', async function() {
  // try {
  //   console.log('cron ok');
  //   await getHeaderJob()
  //   exec('kaggle datasets version -m "tambahan daily data"',{
  //     cwd: 'E:\\APPS_\\Crawling Jobstreet\\Result'
  //   }, (err, stdout, stderr) => console.log(stdout + err + stderr))
  // } catch (e) {
  //   console.log(e);
  // }
});
console.log('done');


async function getHeaderJob () {
  try {
    data = []
    for (let page = 1; page <= 20000; page++) {
      //console.log(page);
      jobId = [];
      var res = await (instance.post('', {"query":"query getJobs($country: String, $locale: String, $keyword: String, $createdAt: String, $jobFunctions: [Int], $categories: [String], $locations: [Int], $careerLevels: [Int], $minSalary: Int, $maxSalary: Int, $salaryType: Int, $candidateSalary: Int, $candidateSalaryCurrency: String, $datePosted: Int, $jobTypes: [Int], $workTypes: [String], $industries: [Int], $page: Int, $pageSize: Int, $companyId: String, $advertiserId: String, $userAgent: String, $accNums: Int, $subAccount: Int, $minEdu: Int, $maxEdu: Int, $edus: [Int], $minExp: Int, $maxExp: Int, $seo: String, $searchFields: String, $candidateId: ID, $isDesktop: Boolean, $isCompanySearch: Boolean, $sort: String, $sVi: String, $duplicates: String, $flight: String, $solVisitorId: String) {\n  jobs(country: $country, locale: $locale, keyword: $keyword, createdAt: $createdAt, jobFunctions: $jobFunctions, categories: $categories, locations: $locations, careerLevels: $careerLevels, minSalary: $minSalary, maxSalary: $maxSalary, salaryType: $salaryType, candidateSalary: $candidateSalary, candidateSalaryCurrency: $candidateSalaryCurrency, datePosted: $datePosted, jobTypes: $jobTypes, workTypes: $workTypes, industries: $industries, page: $page, pageSize: $pageSize, companyId: $companyId, advertiserId: $advertiserId, userAgent: $userAgent, accNums: $accNums, subAccount: $subAccount, minEdu: $minEdu, edus: $edus, maxEdu: $maxEdu, minExp: $minExp, maxExp: $maxExp, seo: $seo, searchFields: $searchFields, candidateId: $candidateId, isDesktop: $isDesktop, isCompanySearch: $isCompanySearch, sort: $sort, sVi: $sVi, duplicates: $duplicates, flight: $flight, solVisitorId: $solVisitorId)" + 
        "{\n    ...LegacyCompat_SearchResult\n    relatedSearchKeywords {\n      keywords\n      type\n      totalJobs\n    }\n  }\n}\n\nfragment LegacyCompat_SearchResult on SearchResult {\n  total\n  totalJobs\n  aigdpRelatedSearch\n  relatedSearchKeywords {\n    keywords\n    type\n    totalJobs\n  }\n  solMetadata\n  suggestedEmployer {\n    name\n    totalJobs\n  }\n  queryParameters {\n    key\n    searchFields\n    pageSize\n  }\n  gdpSearchAlgoGroup\n  experiments {\n    flight\n  }\n  jobs {\n    id\n    adType\n    sourceCountryCode\n    isStandout\n    companyMeta {\n      id\n      advertiserId\n      isPrivate\n      name\n      logoUrl\n      slug\n    }\n    jobTitle\n    jobUrl\n    jobTitleSlug\n    description\n    employmentTypes {\n      code\n      name\n    }\n    sellingPoints\n    locations {\n      code\n      name\n      slug\n      children {\n        code\n        name\n        slug\n      }\n    }\n    categories {\n      code\n      name\n      children {\n        code\n        name\n      }\n    }\n    postingDuration\n    postedAt\n    salaryRange {\n      currency\n      max\n      min\n      period\n      term\n    }\n    salaryVisible\n    bannerUrl\n    isClassified\n    solMetadata\n  }\n}","variables":{"keyword":"","jobFunctions":[],"locations":[],"salaryType":1,"maxSalary":2147483647,"jobTypes":[],"createdAt":"1d","careerLevels":[],"page":page,"sort":"createdAt","country":"id","sVi":"","candidateId":1,"solVisitorId":"6bf98uj3-083j-845h-hw38-1bf8b79a43e8","categories":[],"workTypes":[],"userAgent":"Mozilla/5.0%20(Windows%20NT%2010.0;%20Win64;%20x64)%20AppleWebKit/537.36%20(KHTML,%20like%20Gecko)%20Chrome/96.0.4664.45%20Safari/537.36","industries":[],"locale":"id"}}))
        for (const x of res.data.data.jobs.jobs) {
          jobId.push(new JobstreetModel(x.adType, 
            x.categories.map(y => y.code), 
            x.categories.map(y => y.name), 
            x.companyMeta.id, 
            x.companyMeta.name, 
            x.companyMeta.isPrivate, 
            '',
            x.employmentTypes.map(y => y.code), 
            x.id, 
            x.isClassified, 
            x.isStandout, 
            x.jobTitle, 
            x.jobUrl, 
            x.locations.map(y => y.name), 
            x.postedAt, 
            x.postingDuration, 
            x.salaryRange.currency, 
            x.salaryRange.min, 
            x.salaryRange.max, 
            x.salaryRange.period, 
            x.salaryRange.term, 
            x.sellingPoints));
        }
      
      if(jobId.length == 0) break
      //console.log(jobId);
      data = data.concat(jobId)
    }

    for (const e of data) {
      var resDetail = await (instance.post('',{"query":"query getJobDetail($jobId: String, $locale: String, $country: String, $candidateId: ID, $solVisitorId: String, $flight: String) {\n  jobDetail(\n    jobId: $jobId\n    locale: $locale\n    country: $country\n    candidateId: $candidateId\n    solVisitorId: $solVisitorId\n    flight: $flight\n  ) {\n    id\n    pageUrl\n    jobTitleSlug\n    applyUrl {\n      url\n      isExternal\n    }\n    isExpired\n    isConfidential\n    isClassified\n    accountNum\n    advertisementId\n    subAccount\n    showMoreJobs\n    adType\n    header {\n      banner {\n        bannerUrls {\n          large\n        }\n      }\n      salary {\n        max\n        min\n        type\n        extraInfo\n        currency\n        isVisible\n      }\n      logoUrls {\n        small\n        medium\n        large\n        normal\n      }\n      jobTitle\n      company {\n        name\n        url\n        slug\n        advertiserId\n      }\n      review {\n        rating\n        numberOfReviewer\n      }\n      expiration\n      postedDate\n      postedAt\n      isInternship\n    }\n    companyDetail {\n      companyWebsite\n      companySnapshot {\n        avgProcessTime\n        registrationNo\n        employmentAgencyPersonnelNumber\n        employmentAgencyNumber\n        telephoneNumber\n        workingHours\n        website\n        facebook\n        size\n        dressCode\n        nearbyLocations\n      }\n      companyOverview {\n        html\n      }\n      videoUrl\n      companyPhotos {\n        caption\n        url\n      }\n    }\n    jobDetail {\n      summary\n      jobDescription {\n        html\n      }\n      jobRequirement {\n        careerLevel\n        yearsOfExperience\n        qualification\n        fieldOfStudy\n        industryValue {\n          value\n          label\n        }\n        skills\n        employmentType\n        languages\n        postedDate\n        closingDate\n        jobFunctionValue {\n          code\n          name\n          children {\n            code\n            name\n          }\n        }\n        benefits\n      }\n      whyJoinUs\n    }\n    location {\n      location\n      locationId\n      omnitureLocationId\n    }\n    sourceCountry\n  }\n}\n", "variables": {"jobId": `${e.employment}`,"country": "id","locale": "id","candidateId": "","solVisitorId": "69217709-bfc6-4502-ab46-4e7d01fce568"}}))
      var jobDescription= resDetail.data.data.jobDetail?.jobDetail?.jobDescription?.html ?? '';
      e.description = jobDescription
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    today = dayjs().format('YYYY-MM-DD')
    const ws = fs.createWriteStream(`./Result/jobstreet_${today}.csv`);
      fastcsv
        .write(data, { headers: true })
        .pipe(ws);
    console.log('running sukses');

  } catch (error) {
    console.log(error);
  }
}

async function getDetailJob(id) {
    var resDetail = await (instance.post('',{"query":"query getJobDetail($jobId: String, $locale: String, $country: String, $candidateId: ID, $solVisitorId: String, $flight: String) {\n  jobDetail(\n    jobId: $jobId\n    locale: $locale\n    country: $country\n    candidateId: $candidateId\n    solVisitorId: $solVisitorId\n    flight: $flight\n  ) {\n    id\n    pageUrl\n    jobTitleSlug\n    applyUrl {\n      url\n      isExternal\n    }\n    isExpired\n    isConfidential\n    isClassified\n    accountNum\n    advertisementId\n    subAccount\n    showMoreJobs\n    adType\n    header {\n      banner {\n        bannerUrls {\n          large\n        }\n      }\n      salary {\n        max\n        min\n        type\n        extraInfo\n        currency\n        isVisible\n      }\n      logoUrls {\n        small\n        medium\n        large\n        normal\n      }\n      jobTitle\n      company {\n        name\n        url\n        slug\n        advertiserId\n      }\n      review {\n        rating\n        numberOfReviewer\n      }\n      expiration\n      postedDate\n      postedAt\n      isInternship\n    }\n    companyDetail {\n      companyWebsite\n      companySnapshot {\n        avgProcessTime\n        registrationNo\n        employmentAgencyPersonnelNumber\n        employmentAgencyNumber\n        telephoneNumber\n        workingHours\n        website\n        facebook\n        size\n        dressCode\n        nearbyLocations\n      }\n      companyOverview {\n        html\n      }\n      videoUrl\n      companyPhotos {\n        caption\n        url\n      }\n    }\n    jobDetail {\n      summary\n      jobDescription {\n        html\n      }\n      jobRequirement {\n        careerLevel\n        yearsOfExperience\n        qualification\n        fieldOfStudy\n        industryValue {\n          value\n          label\n        }\n        skills\n        employmentType\n        languages\n        postedDate\n        closingDate\n        jobFunctionValue {\n          code\n          name\n          children {\n            code\n            name\n          }\n        }\n        benefits\n      }\n      whyJoinUs\n    }\n    location {\n      location\n      locationId\n      omnitureLocationId\n    }\n    sourceCountry\n  }\n}\n", "variables": {"jobId": `${id}`,"country": "id","locale": "id","candidateId": "","solVisitorId": "69217709-bfc6-4502-ab46-4e7d01fce568"}}))
    var jobDescription= resDetail.data.data.jobDetail?.jobDetail?.jobDescription?.html ?? '';
    var jobModel = new JobstreetModel(
      x.id, 
      x.adType, 
      x.categories.map(y => y.code), 
      x.categories.map(y => y.name), 
      x.companyMeta.id, 
      x.companyMeta.name, 
      x.companyMeta.isPrivate, 
      '',
      jobDescription,
      x.employmentTypes.map(y => y.code), 
      x.isClassified, 
      x.isStandout, 
      x.jobTitle, 
      x.jobUrl, 
      x.locations.map(y => y.name), 
      x.postedAt, 
      x.postingDuration, 
      x.salaryRange.currency, 
      x.salaryRange.min, 
      x.salaryRange.max, 
      x.salaryRange.period, 
      x.salaryRange.term, 
      x.sellingPoints)
    e.description = jobDescription
    await new Promise(resolve => setTimeout(resolve, 20000));
    return jobModel;
}

function saveData(data) {
  today = dayjs().format('YYYY-MM-DD')
  const ws = fs.createWriteStream(`./Result/jobstreet_${today}.csv`);
    fastcsv
      .write(data, { headers: true })
      .pipe(ws);
  console.log('running sukses');
}

async function crawlingDetailData(){
  var data = [];
  for (const e of listId) {
    var datum = await getDetailJob(e);
    data.push(datum);
  }
  saveData(data);
}

function getJobIds(){
  var a;
}

class JobstreetModel {
  constructor(id, adType, categoriesCode, categoriesName, companyId, companyName, companyPrivate, companyDescription, description, employment, isClassified, isStandout, jobTitle, jobUrl, locations, postedAt, postingDuration, salarycurrency, salaryMin, salaryMax, salaryPeriod, salaryTerm, sellingPoints, jobDescription) {
    this.id = id;
    this.adType = adType;
    this.categoriesCode = categoriesCode;
    this.categoriesName = categoriesName;
    this.companyId = companyId;
    this.companyName = companyName;
    this.companyPrivate = companyPrivate;
    this.companyDescription = companyDescription;
    this.description = description;
    this.employment = employment;
    this.isClassified = isClassified;
    this.isStandout = isStandout;
    this.jobTitle = jobTitle;
    this.jobUrl = jobUrl;
    this.locations = locations;
    this.postingDuration = postingDuration;
    this.postedAt = postedAt;
    this.salarycurrency = salarycurrency;
    this.salaryMin = salaryMin;
    this.salaryMax = salaryMax;
    this.salaryPeriod = salaryPeriod;
    this.salaryTerm = salaryTerm;
    this.sellingPoints = sellingPoints;
  }
}